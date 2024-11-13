import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TopPlayersComponent } from "./top-players.component";

describe("TopPlayersComponent", () => {
  let component: TopPlayersComponent;
  let fixture: ComponentFixture<TopPlayersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopPlayersComponent],
    });
    fixture = TestBed.createComponent(TopPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
