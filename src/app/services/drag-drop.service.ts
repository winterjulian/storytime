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
import {DropEventData} from '../interfaces/drop-event-data';
import {UserJourney} from '../interfaces/user-journey';

@Injectable({providedIn: 'root'})
export class DragDropService {
  private store = inject(StoreService);

  public commandHistory: DropCommand[] = [];
  public connectedDropZones = signal<Array<string>>(['issue-source']);
  public currentHistoryIndex = signal<number>(-1);
  public isUndoDisabled = computed(() => {
    return this.currentHistoryIndex() === -1;
  });
  public isRedoDisabled = computed(() => {
    return this.currentHistoryIndex() >= this.commandHistory.length - 1;
  });

  // ==========
  // DROP ZONES
  // ==========

  public registerDropZone(connectedDropZone: string) {
    this.connectedDropZones.update((array) => [...array, connectedDropZone]);
  }

  public removeAllDropZonesFromJourney(journey: UserJourney): void {
    journey.userSteps.forEach((step) => {
      this.removeAllDropZonesFromStep(step)
    })
  }

  public removeAllDropZonesFromStep(step: UserStep) {
    this.removeDropZone('drop-' + step.journeyId + '-' + step.id);
  }

  public removeDropZone(connectedDropZone: string) {
    this.connectedDropZones.update((array) =>
      array.filter((element) => element !== connectedDropZone),
    );
  }

  // =========
  // DRAG&DROP
  // =========

  executeDropCommand(event: CdkDragDrop<DropEventData>) {
    const command = this.generateCommandObject(event);
    this.executeDrop(command);
    this.addToHistory(command);
  }

  private executeDrop(command: DropCommand) {
    const sourceArray: StepIssue[] | undefined = this.store.containerMap.get(command.sourceContainerId);
    const targetArray: StepIssue[] | undefined = this.store.containerMap.get(command.targetContainerId);

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
      this.store.transferIssues(command.item, command.targetStepId);
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

  // =======
  // HISTORY
  // =======

  private addToHistory(command: DropCommand) {
    // Cut history if in the middle of undo => kill the future (redo)
    this.commandHistory = this.commandHistory.slice(
      0,
      this.currentHistoryIndex() + 1,
    );
    this.commandHistory.push(command);
    this.currentHistoryIndex.update((v) => v + 1);
  }

  public clearHistory(): void {
    this.commandHistory = [];
    this.currentHistoryIndex.set(-1);
  }

  // =======
  // HELPERS
  // =======

  private generateCommandObject(event: CdkDragDrop<DropEventData>): DropCommand {
    return {
      type:
        event.previousContainer === event.container ? 'reorder' : 'transfer',
      sourceStepId: event.previousContainer.data.stepId,
      targetStepId: event.container.data.stepId,
      sourceContainerId: event.previousContainer.id,
      targetContainerId: event.container.id,
      sourceIndex: event.previousIndex,
      targetIndex: event.currentIndex,
      item: event.previousContainer.data.stepIssues[event.previousIndex],
    };
  }

  private reverseCommand(command: DropCommand) {
    // Todo: Change: very redundant (see executeDrop())
    const sourceArray = this.store.containerMap.get(command.sourceContainerId);
    const targetArray = this.store.containerMap.get(command.targetContainerId);

    if (command.type === 'reorder') {
      moveItemInArray(sourceArray!, command.targetIndex, command.sourceIndex);
    } else {
      transferArrayItem(
        targetArray!,
        sourceArray!,
        command.targetIndex,
        command.sourceIndex,
      );
      this.store.transferIssues(command.item, command.sourceStepId);
    }
  }
}
