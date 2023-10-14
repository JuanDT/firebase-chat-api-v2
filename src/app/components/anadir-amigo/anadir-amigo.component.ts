import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-anadir-amigo',
  templateUrl: './anadir-amigo.component.html',
  styleUrls: ['./anadir-amigo.component.css']
})
export class AnadirAmigoComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  addFriend(){

  }
}
