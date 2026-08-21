import mongoose, { Model, Schema } from "mongoose";

export interface CertificationDocument {
  id: string;
  userId: string;
  name: string;
  organization: string;
  dateEarned: string;
  certificateLink?: string;
  createdAt: string;
}

const certificationSchema = new Schema<CertificationDocument>({
  id: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  dateEarned: { type: String, required: true, trim: true },
  certificateLink: { type: String, default: "", trim: true },
  createdAt: { type: String, required: true },
});

certificationSchema.index({ id: 1, userId: 1 }, { unique: true });
certificationSchema.index({ userId: 1, createdAt: -1 });

const Certification: Model<CertificationDocument> =
  mongoose.models.Certification ??
  mongoose.model<CertificationDocument>("Certification", certificationSchema);

export default Certification;
