import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Inject } from '@angular/core';

@Component({
  selector: 'app-game-start',
  templateUrl: './game-start.component.html',
  styleUrls: ['./game-start.component.scss']
})
export class GameStartComponent implements OnInit {

  // jeśli nie dodasz static: true to będzie undefined
  @ViewChild('empty', {static: true}) empty: ElementRef<HTMLLIElement>;
  allGameRows: Array<HTMLUListElement>;
  allDraggableElements: NodeListOf<HTMLLIElement>;
  draggedElement: HTMLDivElement;
  draggedElementParent: HTMLLIElement;
  currentRowIndex: number;
  allCurrentRowGridItems: NodeListOf<HTMLLIElement>;
  currentEmptyIndex:number;
  // relative elements
  allRelativeElements: Array<HTMLLIElement>;
  relativeTop: HTMLLIElement | null;
  relativeBottom: HTMLLIElement | null;
  relativeLeft: HTMLLIElement | null;
  relativeRight: HTMLLIElement | null;

  constructor(
    // empty: HTMLLIElement,
    // draggedElement: HTMLDivElement,
    // draggedElementParent: HTMLLIElement,
    // currentRowIndex: number,
    // allCurrentRowGridItems: NodeListOf<HTMLLIElement>,
    // currentEmptyIndex: number,
    // allRelativeElements: Array<HTMLLIElement>,
    // relativeTop: HTMLLIElement | null,
    // relativeBottom: HTMLLIElement | null,
    // relativeLeft: HTMLLIElement | null,
    // relativeRight: HTMLLIElement | null
  ) {
    // this.empty = empty;
    // this.draggedElement = draggedElement;
    // this.draggedElementParent = draggedElementParent;
    // this.currentRowIndex = currentRowIndex;
    // this.allCurrentRowGridItems = allCurrentRowGridItems;
    // this.currentEmptyIndex = currentEmptyIndex;
    // // relative elements
    // this.allRelativeElements = allRelativeElements;
    // this.relativeTop = relativeTop;
    // this.relativeBottom = relativeBottom;
    // this.relativeLeft = relativeLeft;
    // this.relativeRight = relativeRight;
    this.allGameRows = Array.from(document.querySelectorAll('.pietnastka-grid__row'));
    // empty = document.querySelector('.pietnastka-grid__item.empty');

   }

  ngOnInit(): void {
    console.log(this.empty.nativeElement);
  }


  dragStart(event : { target: HTMLDivElement; }): void {
      event.target.classList.add('hold');
      this.draggedElement = event.target;
      (this.draggedElementParent as HTMLLIElement) = event.target.parentElement as HTMLLIElement;
      setTimeout(() => event.target.classList.add('invisible'), 0);
  }
  boundDragStart = this.dragStart.bind(this);

  dragEnd(event: DragEvent): void {
      console.log('event dragend został wywołany!');
      const eventTarget = event.target as HTMLLIElement;
      eventTarget.classList.remove('invisible');
  }
  boundDragEnd = this.dragEnd.bind(this);

  dragOver(event: DragEvent): void {
      event.preventDefault();
  }
  boundDragOver = this.dragOver.bind(this);

  dragEnter(event: { target: HTMLDivElement; }): void {
      event.target.classList.add('hovered');
  }
  boundDragEnter = this.dragEnter.bind(this);

  removeClassOnDragLeave(event: DragEvent): void {
      const eventTarget = event.target as HTMLLIElement;
      eventTarget.classList.remove('hovered');
  }
  boundRemoveClassOnDragLeave = this.removeClassOnDragLeave.bind(this);

  addListenersToEmpty(): void {
      this.empty.nativeElement.addEventListener('dragover', this.boundDragOver, false);
      // this.empty.addEventListener('dragenter', this.boundDragEnter, false);
      this.empty.nativeElement.addEventListener('dragleave', this.boundRemoveClassOnDragLeave, false);
      // this.empty.addEventListener('drop', this.boundDropHandler, false);
  }


  removeListenersFromEmpty(): void {
      this.empty.nativeElement.removeEventListener('dragover', this.boundDragOver);
      // this.empty.removeEventListener('dragenter', this.boundDragEnter);
      this.empty.nativeElement.removeEventListener('dragleave',this.boundRemoveClassOnDragLeave);
      // this.empty.removeEventListener('drop',  this.boundDropHandler);
  }

  dropHandler(event: { target: HTMLDivElement; }) {
      // 1. usuwana jest klasa 'empty' z elementu pierwotnie zawierającego klasę 'empty' ...
      this.empty.nativeElement.classList.remove('empty');
      this.removeListenersFromEmpty();
      // 2. dodawana jest klasa empty do rodzica elementu który wywołał wykonanie eventu

      // this.empty.nativeElement = this.draggedElementParent; -> tutaj nie można przypisać do empty.nativeElement this.draggedElementParent;

      this.empty.nativeElement.classList.add('empty');
      // 2. Z elementów zawieracjących klasę jsDraggable usuwane są EventListener 'dragstart' z pomocą removeEventListener
      this.allDraggableElements.forEach(item => {
          // item.removeEventListener('dragstart', this.boundDragStart);
      });
      // 3. Z elementów zawierających klasę jsDraggable usuwana jest klasa jsDraggable i ustawiany jest atrybut draggable na false
      this.allDraggableElements = document.querySelectorAll('.pietnastka-grid__number.jsDraggable');
      this.allDraggableElements.forEach(item => {
          item.classList.remove('jsDraggable');
          item.setAttribute('draggable', 'false');
      });
      // 4. kalkulowane są elementy do kórych mają być dodane klasy jsDraggable, EventListenery oraz atrybuty draggable=true
      this.currentRowIndex = Array.from(this.allGameRows).indexOf(this.empty.nativeElement.parentNode as HTMLUListElement);
      this.allCurrentRowGridItems = this.allGameRows[this.currentRowIndex].querySelectorAll('.pietnastka-grid__item');
      this.currentEmptyIndex = Array.from(this.allCurrentRowGridItems).indexOf(this.empty.nativeElement) + 1;
      this.allRelativeElements = [];
      this.relativeTop = this.allGameRows[this.currentRowIndex-1] ? this.allGameRows[this.currentRowIndex-1].querySelector('.pietnastka-grid__item:nth-child('+this.currentEmptyIndex+')') : null;
      this.relativeBottom = this.allGameRows[this.currentRowIndex+1] ? this.allGameRows[this.currentRowIndex+1].querySelector('.pietnastka-grid__item:nth-child('+this.currentEmptyIndex+')') : null;
      this.relativeLeft = this.allGameRows[this.currentRowIndex].querySelector('.pietnastka-grid__item:nth-child('+(this.currentEmptyIndex-1)+')');
      this.relativeRight = this.allGameRows[this.currentRowIndex].querySelector('.pietnastka-grid__item:nth-child('+(this.currentEmptyIndex+1)+')');
      this.allRelativeElements = [this.relativeTop,this.relativeBottom,this.relativeLeft,this.relativeRight].filter(item => item !== null) as HTMLLIElement[];


      event.target.append(this.draggedElement);
      event.target.classList.remove('hovered');
      // this.allRelativeElements.filter(item => item != null).forEach(item => {

      //   const gridNumberElement = item.querySelector('.pietnastka-grid__number');
      //   if (gridNumberElement == null) {
      //     return false;
      //   }
      //     gridNumberElement.classList.add('jsDraggable');
      //     // gridNumberElement.addEventListener('dragstart', this.boundDragStart);
      //     // gridNumberElement.addEventListener('dragend', this.boundDragEnd);
      //     gridNumberElement.setAttribute('draggable', "true");

      // });
      this.addListenersToEmpty();

  }
  boundDropHandler = this.dropHandler.bind(this);

}
