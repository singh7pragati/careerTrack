import mongoose, { Model, Schema } from "mongoose";

export interface ProfileDocument {
  userId: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  graduationYear: string;
  updatedAt: string;
}

const profileSchema = new Schema<ProfileDocument>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  college: { type: String, default: "", trim: true },
  degree: { type: String, default: "", trim: true },
  graduationYear: { type: String, default: "", trim: true },
  updatedAt: { type: String, required: true },
});

const Profile: Model<ProfileDocument> =
  mongoose.models.Profile ?? mongoose.model<ProfileDocument>("Profile", profileSchema);

export default Profile;
