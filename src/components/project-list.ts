/// <reference path="./base-component.ts" />
/// <reference path="./project-item.ts" />
/// <reference path="../util/project-state.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../models/darg-drop.ts" />
/// <reference path="../models/project.ts" />

namespace App {
  // PojectList class
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((proj) => {
          if (this.type === "active") {
            return proj.status === ProjectStatus.ACTIVE;
          }
          return proj.status === ProjectStatus.FINISHED;
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;

      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }

    @Autobind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listElement = this.element.querySelector("ul")!;
        listElement.classList.add("droppable");
      }
    }
    @Autobind
    dropHandler(event: DragEvent): void {
      const projectId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        projectId,
        this.type === "active" ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED
      );
    }
    @Autobind
    dragLeaveHandler(_: DragEvent): void {
      const listElement = this.element.querySelector("ul")!;
      listElement.classList.remove("droppable");
    }

    private renderProjects() {
      const listElement = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;

      listElement.innerHTML = "";

      for (const project of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, project);
      }
    }
  }
}