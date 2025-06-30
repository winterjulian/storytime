import { computed, Injectable, signal } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Issue } from '../interfaces/issue';
import { DropCommand } from '../interfaces/drop-command';

@Injectable({ providedIn: 'root' })
export class DragDropService {
  public connectedDropZones = signal<Array<string>>(['issue-source']);

  public commandHistory: DropCommand[] = [];
  public currentHistoryIndex = signal<number>(-1);

  public canUndo = computed(() => {
    return this.currentHistoryIndex() === -1;
  });
  public canRedo = computed(() => {
    return this.currentHistoryIndex() >= this.commandHistory.length - 1;
  });

  public registerDropZone(connectedDropZone: string) {
    this.connectedDropZones.update((array) => [...array, connectedDropZone]);
  }

  public removeDropZone(connectedDropZone: string) {
    this.connectedDropZones.update((array) =>
      array.filter((element) => element !== connectedDropZone),
    );
  }

  private containerMap = new Map<string, Issue[]>();

  registerContainer(id: string, data: Issue[]) {
    this.containerMap.set(id, data);
  }

  executeDropCommand(event: CdkDragDrop<Issue[]>) {
    const command = this.generateCommandObject(event);
    this.executeCommand(command);
    this.addToHistory(command);
  }

  private generateCommandObject(event: CdkDragDrop<Issue[]>): DropCommand {
    return {
      type:
        event.previousContainer === event.container ? 'reorder' : 'transfer',
      sourceContainerId: event.previousContainer.id,
      targetContainerId: event.container.id,
      sourceIndex: event.previousIndex,
      targetIndex: event.currentIndex,
      item: event.previousContainer.data[event.previousIndex],
      timestamp: new Date(),
    };
  }

  private executeCommand(command: DropCommand) {
    const sourceArray = this.containerMap.get(command.sourceContainerId);
    const targetArray = this.containerMap.get(command.targetContainerId);

    if (!sourceArray || !targetArray) return;

    if (command.type === 'reorder') {
      moveItemInArray(sourceArray, command.sourceIndex, command.targetIndex);
    } else {
      transferArrayItem(
        sourceArray,
        targetArray,
        command.sourceIndex,
        command.targetIndex,
      );
    }
  }

  undo(): boolean {
    if (this.currentHistoryIndex() < 0) return false;

    const command = this.commandHistory[this.currentHistoryIndex()];
    this.reverseCommand(command);
    this.currentHistoryIndex.update((v) => v - 1);
    return true;
  }

  redo(): boolean {
    if (this.currentHistoryIndex() >= this.commandHistory.length - 1)
      return false;

    this.currentHistoryIndex.update((v) => v + 1);
    const command = this.commandHistory[this.currentHistoryIndex()];
    this.executeCommand(command);
    return true;
  }

  private reverseCommand(command: DropCommand) {
    const sourceArray = this.containerMap.get(command.sourceContainerId);
    const targetArray = this.containerMap.get(command.targetContainerId);

    if (command.type === 'reorder') {
      moveItemInArray(sourceArray!, command.targetIndex, command.sourceIndex);
    } else {
      transferArrayItem(
        targetArray!,
        sourceArray!,
        command.targetIndex,
        command.sourceIndex,
      );
    }
  }

  private addToHistory(command: DropCommand) {
    // Cut history if in the middle of undo => kill the future (redo)
    this.commandHistory = this.commandHistory.slice(
      0,
      this.currentHistoryIndex() + 1,
    );
    this.commandHistory.push(command);
    this.currentHistoryIndex.update((v) => v + 1);
  }
}
