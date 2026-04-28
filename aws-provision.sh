#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# BragBoard AWS Provisioning Script
# Provisions all AWS infrastructure via CLI (no console needed).
#
# Usage:
#   chmod +x aws-provision.sh
#   ./aws-provision.sh
#
# Prerequisites:
#   - AWS CLI v2 installed: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
#   - Configured: aws configure  (Access Key, Secret, Region, Output=json)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config — edit these if needed ────────────────────────────────────────────
KEY_NAME="bragboard-key"
KEY_FILE="${KEY_NAME}.pem"
SG_NAME="bragboard-sg"
INSTANCE_NAME="bragboard"
INSTANCE_TYPE="t2.micro"       # Free tier eligible (first 12 months)
VOLUME_SIZE_GB=20
OUTPUT_FILE="aws-deploy-info.txt"
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   BragBoard AWS Infrastructure Provisioner   ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 0. Verify AWS CLI is configured ──────────────────────────────────────────
echo "==> Checking AWS CLI..."
aws sts get-caller-identity --query "Account" --output text > /dev/null
echo "    ✅ AWS CLI is configured"
echo ""

# ── 1. Create Key Pair ────────────────────────────────────────────────────────
echo "==> Creating key pair: $KEY_NAME"
if [ -f "$KEY_FILE" ]; then
  echo "    ⚠️  $KEY_FILE already exists — skipping key pair creation"
else
  aws ec2 create-key-pair \
    --key-name "$KEY_NAME" \
    --query "KeyMaterial" \
    --output text > "$KEY_FILE"
  chmod 400 "$KEY_FILE"
  echo "    ✅ Key saved to $KEY_FILE (chmod 400)"
fi
echo ""

# ── 2. Create Security Group ──────────────────────────────────────────────────
echo "==> Creating security group: $SG_NAME"

# Check if it already exists
EXISTING_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=$SG_NAME" \
  --query "SecurityGroups[0].GroupId" \
  --output text 2>/dev/null || echo "None")

if [ "$EXISTING_SG" != "None" ] && [ -n "$EXISTING_SG" ]; then
  SG_ID="$EXISTING_SG"
  echo "    ⚠️  Security group already exists: $SG_ID — reusing"
else
  SG_ID=$(aws ec2 create-security-group \
    --group-name "$SG_NAME" \
    --description "BragBoard EC2 security group" \
    --query "GroupId" \
    --output text)
  echo "    ✅ Created security group: $SG_ID"

  echo "==> Adding inbound rules..."
  # SSH
  aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp --port 22 --cidr 0.0.0.0/0
  # HTTP
  aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp --port 80 --cidr 0.0.0.0/0
  # HTTPS (for certbot / domain later)
  aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp --port 443 --cidr 0.0.0.0/0
  echo "    ✅ Ports 22, 80, 443 open"
fi
echo ""

# ── 3. Find Latest Ubuntu 24.04 LTS AMI ──────────────────────────────────────
echo "==> Looking up latest Ubuntu 24.04 LTS AMI..."
AMI_ID=$(aws ec2 describe-images \
  --owners 099720109477 \
  --filters \
    "Name=name,Values=ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*" \
    "Name=state,Values=available" \
  --query "sort_by(Images, &CreationDate)[-1].ImageId" \
  --output text)
echo "    ✅ AMI: $AMI_ID"
echo ""

# ── 4. Launch EC2 Instance ────────────────────────────────────────────────────
echo "==> Launching EC2 instance ($INSTANCE_TYPE)..."
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id "$AMI_ID" \
  --instance-type "$INSTANCE_TYPE" \
  --key-name "$KEY_NAME" \
  --security-group-ids "$SG_ID" \
  --block-device-mappings "[{
    \"DeviceName\": \"/dev/sda1\",
    \"Ebs\": {
      \"VolumeSize\": $VOLUME_SIZE_GB,
      \"VolumeType\": \"gp3\",
      \"DeleteOnTermination\": false
    }
  }]" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
  --query "Instances[0].InstanceId" \
  --output text)

echo "    ✅ Instance launched: $INSTANCE_ID"
echo "==> Waiting for instance to reach 'running' state (this takes ~30s)..."
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
echo "    ✅ Instance is running!"
echo ""

# ── 5. Allocate & Attach Elastic IP ──────────────────────────────────────────
echo "==> Allocating Elastic IP..."
ALLOC_ID=$(aws ec2 allocate-address \
  --domain vpc \
  --query "AllocationId" \
  --output text)
echo "    ✅ Allocated: $ALLOC_ID"

echo "==> Associating Elastic IP with instance..."
aws ec2 associate-address \
  --instance-id "$INSTANCE_ID" \
  --allocation-id "$ALLOC_ID" \
  > /dev/null

EC2_IP=$(aws ec2 describe-addresses \
  --allocation-ids "$ALLOC_ID" \
  --query "Addresses[0].PublicIp" \
  --output text)
echo "    ✅ Public IP: $EC2_IP"
echo ""

# ── 6. Save output ────────────────────────────────────────────────────────────
cat > "$OUTPUT_FILE" <<EOF
# BragBoard AWS Deployment Info
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

INSTANCE_ID=$INSTANCE_ID
SECURITY_GROUP_ID=$SG_ID
ELASTIC_IP_ALLOC_ID=$ALLOC_ID
EC2_PUBLIC_IP=$EC2_IP
AMI_ID=$AMI_ID
KEY_FILE=$KEY_FILE
EOF

echo "==> Saved deployment info to: $OUTPUT_FILE"
echo ""

# ── 7. Print next steps ───────────────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  ✅  Infrastructure Ready!                                          ║"
echo "╠══════════════════════════════════════════════════════════════════════╣"
echo "║                                                                      ║"
echo "║  EC2 Public IP : $EC2_IP"
echo "║  Key file      : $KEY_FILE"
echo "║                                                                      ║"
echo "║  Next — SSH into EC2 and run bootstrap.sh:                          ║"
echo "║                                                                      ║"
echo "║    # Wait ~60s for SSH to become available, then:                   ║"
echo "║    ssh -i $KEY_FILE ubuntu@$EC2_IP"
echo "║    bash <(curl -fsSL https://raw.githubusercontent.com/YOUR_ORG/bragboard-jan-26/main/bootstrap.sh)"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
