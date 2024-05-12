import { ComponentFixture, TestBed } from "@angular/core/testing";

import { serEventComponent } from "./add-database.component";

describe("serEventComponent", () => {
  let component: serEventComponent;
  let fixture: ComponentFixture<serEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [serEventComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(serEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
