export class TaskConfig {
    static quillConfig = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [],
        ['link', 'image']
      ]
    };
  
    // static projectOptions = ['ERP', 'HIS', 'RFID', 'Insurance Broker'];
    // static companyOptions = ['شركة الهدى للمحروقات', 'شركة التامين الوطنية', 'مستشفى الاستشاري', 'البنك العربي'];
    // static personalOptions = ['.net core', 'Angular', 'Flutter'];
}