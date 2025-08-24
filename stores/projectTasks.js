import { defineStore } from "pinia";
import { createProjectTask } from "#imports";
import { createUserTask } from "#imports";
import { removeUserTask } from "#imports";
import { updateProjectTaskStatus } from "#imports";

export const useProjectTaskStore = defineStore("projectTasks", {
  state: () => ({
    tasks: { data: [], loading: false, error: null },
    loading: false,
    error: null,
    createTaskData: { data: null, loading: false, error: null },
    taskDetails: { data: null, loading: false, error: null },
  }),
  actions: {
    async createProjectTask(taskData) {
      this.createTaskData.loading = true
      try {
        const newTask = await createProjectTask(taskData)
        this.tasks.data.push(newTask)
        this.createTaskData.data = newTask
      } catch (error) {
        this.createTaskData.error = error
        throw error
      } finally {
        this.createTaskData.loading = false
      }
    },
    async fetchProjectTaskDetails(projectTaskId) {
      this.taskDetails.loading = true
      try {
        const details = await getProjectTaskDetails(projectTaskId)
        this.taskDetails.data = details
      } catch (error) {
        this.taskDetails.error = error
        throw error
      } finally {
        this.taskDetails.loading = false
      }
    },
    async createUserTask(projectTaskId, userId) {
      try {
        const data = await createUserTask(projectTaskId, userId);
        return data;
      } catch (error) {
        console.error("Error creating user task:", error);
      }
    },
    addUserTask(userTask) {
      if (this.taskDetails.data) {
        this.taskDetails.data.projectTaskUsers.push(userTask);
      }
    },
    async removeUserTask(userTaskId) {
      try {
        const removed = await removeUserTask(userTaskId);

        if (removed) {
          const userTaskIndex = this.taskDetails.data.projectTaskUsers.findIndex(user => user.userTaskId === userTaskId);

          if (userTaskIndex === -1) return;

          this.taskDetails.data.projectTaskUsers.splice(userTaskIndex, 1);
        }
      } catch (error) {
        console.error("Error while removing user task:", error)
      }
    },
    async changeProjectTaskStatus(projectTaskId, status) {
      try {
        const updated = await updateProjectTaskStatus(projectTaskId, status);
        console.log("Updated task status:", updated);

        if (updated) {
          this.taskDetails.data.status = updated.status;
        }
      } catch (error) {
        console.error("Error while updating project task status:", error)
      }
    },
    async searchProjectTasks(filters) {
      this.tasks.loading = true;
      try {
        const response = await searchProjectTasks(filters);
        this.tasks.data = response;
      } catch (error) {
        this.tasks.error = error;
        console.error("Error while searching project tasks:", error);
      } finally {
        this.tasks.loading = false;
      }
    },
    async editTask(data) {
      try {
        const editedTask = await editProjectTask(data);
        this.taskDetails.data = editedTask;
      } catch (error) {
        console.error("Error while editing project task:", error);
      }
    }
  },
});