import mongoose, { Model, Schema } from "mongoose";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/types";

export interface ApplicationDocument {
  id: string;
  userId: string;
  companyName: string;
  role: string;
  status: ApplicationStatus;
  applicationDate: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

const applicationSchema = new Schema<ApplicationDocument>({
  id: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  companyName: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: APPLICATION_STATUSES,
    default: "Applied",
  },
  applicationDate: { type: String, required: true },
  location: { type: String, default: "", trim: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

applicationSchema.index({ id: 1, userId: 1 }, { unique: true });
applicationSchema.index({ userId: 1, createdAt: -1 });

const Application: Model<ApplicationDocument> =
  mongoose.models.Application ??
  mongoose.model<ApplicationDocument>("Application", applicationSchema);

export default Application;
