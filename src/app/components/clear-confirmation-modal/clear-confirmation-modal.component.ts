import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clear-confirmation-modal',
  templateUrl: './clear-confirmation-modal.component.html',
  styleUrls: ['./clear-confirmation-modal.component.css']
})
export class ClearConfirmationModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  
}
