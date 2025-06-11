import { db } from "../../database/arango";

const collabCol = db.collection("collaborators");

/**
 * Resolvers de campos aninhados do tipo Task.
 * Exportamos como 'Task' para ser conectado ao schema na raiz.
 */
export const Task = {
  /** Retorna o Collaborator responsável pela task (ou null) */
  assignee: async (parent: any) => {
    if (!parent.assigneeId) return null;            // sem responsável
    try {
      const doc = await collabCol.document(parent.assigneeId);
      return { ...doc, id: doc._key };             // garante campo id!
    } catch {
      return null;                                 // id inválido / não encontrado
    }
  },
};
