// istanbul ignore file

import categoriesJSON from './categorias';
import resolutionsJSON from './resoluciones';
import usersJSON from './usuarios';
import userRequestsJSON from './usuarios/solicitudes';
import userRestrictionsJSON from './usuarios/restricciones';
import workflowsJSON from './flujos';

export default class MockUtils {
  basePath: string;

  constructor() {
    this.basePath = './moks';
  }

  private _readJSON<T>(jsonFile: T, parameter: string | number | null = null, timeout = 1000, notFoundErrorMessage = '') {
    return new Promise<T | T[keyof T]>((resolve, reject) => {
      try {
        const records = jsonFile as Record<string | number, T[keyof T]>;

        if (!jsonFile || (parameter !== null && !(parameter in records))) {
          const error = new Error(notFoundErrorMessage) as Error & { status: number };
          error.status = 404;
          throw error;
        }

        setTimeout(() => {
          resolve(parameter === null ? jsonFile : records[parameter]);
        }, timeout);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUser() { return this._readJSON(usersJSON); }
  getUserRestrictions(userId: string | number) { return this._readJSON(userRestrictionsJSON, userId, 3000, `Could not find restrictions for user of id ${userId}`); }
  getUserRequests(userId: string | number) { return this._readJSON(userRequestsJSON, userId, 1500, `Could not find requests for user of id ${userId}`); }
  getCategory(categoryId: string | number) { return this._readJSON(categoriesJSON, categoryId, 500, `Could not find category of id "${categoryId}"`); }
  getWorkflow(workflowId: string | number) { return this._readJSON(workflowsJSON, workflowId, 1200, `Could not find workflow of id ${workflowId}`); }
  getResolution(resolutionId: string | number) { return this._readJSON(resolutionsJSON, resolutionId, 2200, `Could not find resolution of id ${resolutionId}`); }
}
