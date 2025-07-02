import {computed, inject, Injectable, signal} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {StepIssue} from '../interfaces/step-issue';
import {DropCommand} from '../interfaces/drop-command';
import {UserStep} from '../interfaces/user-step';
import {StoreService} from './store.service';

@Injectable({providedIn: 'root'})
export class DragDropService {
  private store = inject(StoreService);
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
    // TODO: Remove zones from deleted steps/journeys
    this.connectedDropZones.update((array) =>
      array.filter((element) => element !== connectedDropZone),
    );
  }

  private containerMap = new Map<string, StepIssue[]>();

  registerContainer(id: string, data: StepIssue[]) {
    console.log('> registerContainer');
    this.containerMap.set(id, data);
  }

  executeDropCommand(event: CdkDragDrop<StepIssue[]>, userStep?: UserStep) {
    const command = this.generateCommandObject(event);
    this.executeDrop(command, userStep);
    this.addToHistory(command);
  }

  private generateCommandObject(event: CdkDragDrop<StepIssue[]>): DropCommand {
    return {
      type:
        event.previousContainer === event.container ? 'reorder' : 'transfer',
      sourceContainerId: event.previousContainer.id,
      targetContainerId: event.container.id,
      sourceIndex: event.previousIndex,
      targetIndex: event.currentIndex,
      item: event.previousContainer.data[event.previousIndex],
    };
  }

  private executeDrop(command: DropCommand, userStep?: UserStep) {
    const sourceId = command.sourceContainerId;
    const targetId = command.targetContainerId;
    const sourceArray = this.containerMap.get(command.sourceContainerId);
    const targetArray = this.containerMap.get(command.targetContainerId);

    if (userStep) {
      console.log('Target Array === userStep().issues',
        targetArray === userStep.issues);
    }

    if (!sourceArray || !targetArray) return;

    if (command.type === 'reorder') {
      moveItemInArray(sourceArray, command.sourceIndex, command.targetIndex);
    } else {
      console.log('transferArrayItem()')
      transferArrayItem(
        sourceArray,
        targetArray,
        command.sourceIndex,
        command.targetIndex,
      );

      this.store.transferIssues(command.item, userStep?.id);
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
    this.executeDrop(command);
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
