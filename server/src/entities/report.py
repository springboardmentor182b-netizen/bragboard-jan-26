from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.config import Base  # ← change core to config

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(
        Enum("pending", "resolved", "dismissed", name="report_status"),
        default="pending",
        nullable=False,
    )
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    resolved_at = Column(TIMESTAMP, nullable=True)

    # Relationships
    shoutout = relationship("Shoutout", backref="reports")
    reporter = relationship("User", foreign_keys=[reported_by])
    resolver = relationship("User", foreign_keys=[resolved_by])