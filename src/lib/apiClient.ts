import { mockApplications } from "@/lib/mock-data";
import { storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types";

export type CreateApplicationInput = Omit<
  Application,
  "id" | "createdAt" | "updatedAt"
>;

export type ApiMode = "local" | "remote";

export interface ApplicationsAdapter {
  getApplications(): Promise<Application[]>;
  createApplication(data: CreateApplicationInput): Promise<Application>;
  updateApplicationStatus(
    id: string,
    status: ApplicationStatus
  ): Promise<Application>;
  updateApplication(
    id: string,
    data: Partial<Application>
  ): Promise<Application>;
  deleteApplication(id: string): Promise<void>;
  seedApplications?(applications: Application[]): Promise<void>;
}

const localAdapter: ApplicationsAdapter = {
  async getApplications() {
    return storage.getApplications();
  },

  async createApplication(data) {
    const now = new Date().toISOString();
    const application: Application = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const applications = storage.getApplications();
    storage.setApplications([application, ...applications]);
    return application;
  },

  async updateApplicationStatus(id, status) {
    const applications = storage.getApplications();
    const index = applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application not found: ${id}`);
    }

    const updated: Application = {
      ...applications[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    applications[index] = updated;
    storage.setApplications(applications);
    return updated;
  },

  async updateApplication(id, data) {
    const applications = storage.getApplications();
    const index = applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application not found: ${id}`);
    }

    const updated: Application = {
      ...applications[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    applications[index] = updated;
    storage.setApplications(applications);
    return updated;
  },

  async deleteApplication(id) {
    const applications = storage.getApplications();
    storage.setApplications(applications.filter((app) => app.id !== id));
  },

  async seedApplications(applications) {
    if (storage.getApplications().length === 0) {
      storage.setApplications(applications);
    }
  },
};

const remoteAdapter: ApplicationsAdapter = {
  async getApplications() {
    const response = await fetch("/api/applications");
    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }
    return response.json() as Promise<Application[]>;
  },

  async createApplication(data) {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create application");
    }
    return response.json() as Promise<Application>;
  },

  async updateApplicationStatus(id, status) {
    const response = await fetch(`/api/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Failed to update application status");
    }
    return response.json() as Promise<Application>;
  },

  async updateApplication(id, data) {
    const response = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update application");
    }
    return response.json() as Promise<Application>;
  },

  async deleteApplication(id) {
    const response = await fetch(`/api/applications/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete application");
    }
  },
};

function resolveApiMode(): ApiMode {
  const mode = process.env.NEXT_PUBLIC_API_MODE;
  return mode === "remote" ? "remote" : "local";
}

function createAdapter(mode: ApiMode): ApplicationsAdapter {
  return mode === "remote" ? remoteAdapter : localAdapter;
}

class ApiClient {
  private adapter: ApplicationsAdapter;

  constructor(mode: ApiMode = resolveApiMode()) {
    this.adapter = createAdapter(mode);
  }

  getMode(): ApiMode {
    return resolveApiMode();
  }

  setAdapter(adapter: ApplicationsAdapter): void {
    this.adapter = adapter;
  }

  getApplications(): Promise<Application[]> {
    return this.adapter.getApplications();
  }

  createApplication(data: CreateApplicationInput): Promise<Application> {
    return this.adapter.createApplication(data);
  }

  updateApplicationStatus(
    id: string,
    status: ApplicationStatus
  ): Promise<Application> {
    return this.adapter.updateApplicationStatus(id, status);
  }

  updateApplication(
    id: string,
    data: Partial<Application>
  ): Promise<Application> {
    return this.adapter.updateApplication(id, data);
  }

  deleteApplication(id: string): Promise<void> {
    return this.adapter.deleteApplication(id);
  }

  async seedApplications(
    applications: Application[] = mockApplications
  ): Promise<void> {
    await this.adapter.seedApplications?.(applications);
  }
}

export const apiClient = new ApiClient();

export const getApplications = () => apiClient.getApplications();
export const createApplication = (data: CreateApplicationInput) =>
  apiClient.createApplication(data);
export const updateApplicationStatus = (
  id: string,
  status: ApplicationStatus
) => apiClient.updateApplicationStatus(id, status);

export { localAdapter, remoteAdapter };
