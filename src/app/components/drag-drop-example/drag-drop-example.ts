import { Component, signal } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-drop-example',
  standalone: true,
  templateUrl: './drag-drop-example.html',
  imports: [CdkDropList, CdkDrag],
  styleUrls: ['./drag-drop-example.scss'],
})
export class DragDropExampleComponent {
  fruits = signal(['Apfel', 'Banane', 'Orange', 'Birne', 'Kirsche']);
  basket = signal<string[]>([]);

  drop(event: CdkDragDrop<string[]>) {
    const fruit = event.item.data as string;
    const fromList = event.previousContainer.id;
    const toList = event.container.id;

    if (fromList === toList) return;

    if (toList === 'basketList') {
      if (!this.basket().includes(fruit)) {
        this.basket.update((b) => [...b, fruit]);
        this.fruits.update((f) => f.filter((fruitName) => fruitName !== fruit));
      }
    } else if (toList === 'fruitsList') {
      if (!this.fruits().includes(fruit)) {
        this.fruits.update((f) => [...f, fruit]);
        this.basket.update((b) => b.filter((fruitName) => fruitName !== fruit));
      }
    }
  }
}
