import { Component, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Player } from "../../../../models/player.model";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.sass"],
})
export class SearchBarComponent implements OnInit {
  @Output() playerName = new EventEmitter<string>();
  @Output() onSortBy = new EventEmitter<string>();
  searchForm!: FormGroup;
  public isSearched: boolean = false;
  private fb = inject(FormBuilder);


  ngOnInit() {
    this.searchForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  public onSearch() {
    this.playerName.emit(this.searchForm.value.name);
  }
  public onSortPlayers(value: string) {
    this.onSortBy.emit(value)
  }
}
