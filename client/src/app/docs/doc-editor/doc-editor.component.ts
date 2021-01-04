import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Doc } from '../../models/Doc.model';
import { DocsService } from '../docs.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-doc-editor',
  templateUrl: './doc-editor.component.html',
  styleUrls: ['./doc-editor.component.css'],
})
export class DocEditorComponent implements OnInit {
  private docId: string;
  isLoading: boolean = false;
  doc: Doc;
  form: FormGroup;
  isUserAdmin = false;

  constructor(
    public route: ActivatedRoute,
    private docsService: DocsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      content: new FormControl('', { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('docId')) {
        this.docId = paramMap.get('docId');
        this.isLoading = true;
        this.docsService.getDocById(this.docId).subscribe((doc) => {
          this.isLoading = false;
          this.doc = doc;
          this.form.setValue({ content: this.doc.content });
        });
      }
    });

    this.isUserAdmin = this.authService.getIsAdmin();
    this.authService.getAdminStatus().subscribe((isAdmin) => {
      this.isUserAdmin = isAdmin;
    });
  }

  saveDoc() {
    const content: string = this.form.value.content;
    this.isLoading = true;
    this.docsService.updateDoc(this.docId, content);
    this.form.reset();
  }
}
