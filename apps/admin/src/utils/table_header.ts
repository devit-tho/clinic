export interface TableHeader {
  kh: string;
  en: string;
}

export const PATIENT_HEAD_WITH_ACTIONS: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'អត្តសញ្ញាណ', en: 'Identity' },
  { kh: 'អាយុ', en: 'Age' },
  { kh: 'ភេទ', en: 'Gender' },
  { kh: 'លេខទូរស័ព្ទ', en: 'Phone Number' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const PATIENT_HEAD_NO_ACTIONS: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'អត្តសញ្ញាណ', en: 'Identity' },
  { kh: 'អាយុ', en: 'Age' },
  { kh: 'ភេទ', en: 'Gender' },
  { kh: 'លេខទូរស័ព្ទ', en: 'Phone Number' },
];

export const ADMIN_PATIENT_HEAD: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'អត្តសញ្ញាណ', en: 'Identity' },
  { kh: 'អាយុ', en: 'Age' },
  { kh: 'ភេទ', en: 'Gender' },
  { kh: 'សាខា', en: 'Branch' },
  { kh: 'លេខទូរស័ព្ទ', en: 'Phone Number' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const INVOICE_HEAD: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'លេខវិក្កយបត្រ', en: 'No Invoice' },
  { kh: 'ប្រាប់ទូទាត់ដើម', en: 'Default Payment' },
  { kh: 'បញ្ចុះតម្លៃ', en: 'Discount' },
  { kh: 'ប្រាក់ទូទាត់', en: 'Current Payment' },
  { kh: 'ប្រាក់កក់់', en: 'Deposit' },
  { kh: 'នៅខ្វះ', en: 'Balance' },
  { kh: 'ស្ថានភាព​ ការព្យាបាល', en: 'Treatment Status' },
  { kh: 'ស្ថានភាព​ ប្រាក់ទូទាត់', en: 'Payment Status' },
  { kh: 'ថ្ងៃ', en: 'Date' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const INVOICE_HEAD_NO_ACTION: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'លេខវិក្កយបត្រ', en: 'No Invoice' },
  { kh: 'ប្រាប់ទូទាត់ដើម', en: 'Default Payment' },
  { kh: 'បញ្ចុះតម្លៃ', en: 'Discount' },
  { kh: 'ប្រាក់ទូទាត់', en: 'Current Payment' },
  { kh: 'ប្រាក់កក់់', en: 'Deposit' },
  { kh: 'នៅខ្វះ', en: 'Balance' },
  { kh: 'ស្ថានភាព​ ការព្យាបាល', en: 'Treatment Status' },
  { kh: 'ស្ថានភាព​ ប្រាក់ទូទាត់', en: 'Payment Status' },
  { kh: 'ថ្ងៃ', en: 'Date' },
];

export const PATIENT_INVOICE_HEAD_NO_ACTION: TableHeader[] = [
  { kh: 'លេខវិក្កយបត្រ', en: 'No Invoice' },
  { kh: 'ប្រាប់ទូទាត់ដើម', en: 'Default Payment' },
  { kh: 'បញ្ចុះតម្លៃ', en: 'Discount' },
  { kh: 'ប្រាក់ទូទាត់', en: 'Current Payment' },
  { kh: 'ប្រាក់កក់់', en: 'Deposit' },
  { kh: 'នៅខ្វះ', en: 'Balance' },
  { kh: 'ស្ថានភាព​ ការព្យាបាល', en: 'Treatment Status' },
  { kh: 'ស្ថានភាព​ ប្រាក់ទូទាត់', en: 'Payment Status' },
  { kh: 'ថ្ងៃ', en: 'Date' },
];

export const PATIENT_INVOICE_HEAD: TableHeader[] = [
  { kh: 'លេខវិក្កយបត្រ', en: 'No Invoice' },
  { kh: 'ប្រាប់ទូទាត់ដើម', en: 'Default Payment' },
  { kh: 'បញ្ចុះតម្លៃ', en: 'Discount' },
  { kh: 'ប្រាក់ទូទាត់', en: 'Current Payment' },
  { kh: 'ប្រាក់កក់់', en: 'Deposit' },
  { kh: 'នៅខ្វះ', en: 'Balance' },
  { kh: 'ស្ថានភាព​ ការព្យាបាល', en: 'Treatment Status' },
  { kh: 'ស្ថានភាព​ ប្រាក់ទូទាត់', en: 'Payment Status' },
  { kh: 'ថ្ងៃ', en: 'Date' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const TREATMENTDETAIL_HEAD: TableHeader[] = [
  { kh: 'ប្រភេទព្យាបាល', en: 'Type of Treatment' },
  { kh: 'តម្លៃ', en: 'Price' },
  { kh: 'ធ្មេញ', en: 'Tooth' },
  { kh: 'លើ', en: 'Upper' },
  { kh: 'ក្រោម', en: 'Lower' },
  { kh: 'ចំនួន', en: 'Number' },
  { kh: 'សរុប', en: 'Total' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const TREATMENTDETAIL_HEAD_NO_ACTION: TableHeader[] = [
  { kh: 'ប្រភេទព្យាបាល', en: 'Type of Treatment' },
  { kh: 'តម្លៃ', en: 'Price' },
  { kh: 'ធ្មេញ', en: 'Tooth' },
  { kh: 'លើ', en: 'Upper' },
  { kh: 'ក្រោម', en: 'Lower' },
  { kh: 'ចំនួន', en: 'Number' },
  { kh: 'សរុប', en: 'Total' },
];

export const TREATMENT_HEAD: TableHeader[] = [
  { kh: 'ប្រភេទនៃការព្យាបាល', en: 'Type of Treatment' },
  { kh: 'តម្លៃ', en: 'Price' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const TREATMENT_HEAD_NO_ACTION: TableHeader[] = [
  { kh: 'ប្រភេទនៃការព្យាបាល', en: 'Type of Treatment' },
  { kh: 'តម្លៃ', en: 'Price' },
];

export const USER_HEAD: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'តូនាទី', en: 'Role' },
  { kh: 'សាខា', en: 'Username' },
  { kh: 'សកម្មភាពចុងក្រោយ', en: 'Last Active At' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const BRANCH_HEAD: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'ឡូហ្គោ', en: 'Logo' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const STAFFDOCTOR_HEAD: TableHeader[] = [
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'អាយុ', en: 'Age' },
  { kh: 'ភេទ', en: 'Gender' },
  { kh: 'សាខា', en: 'Branch' },
  { kh: 'ថ្ងៃ ខែ​ គំណើត', en: 'Date of Birth' },
  { kh: 'អុីមែល', en: 'Email' },
  { kh: 'លេខទូរស័ព្ទ', en: 'Phone Number' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const DETAIL_HEAD: TableHeader[] = [
  { kh: 'ល.រ', en: 'No' },
  { kh: 'ប្រភេទព្យាបាល', en: 'Treatment Type' },
  { kh: 'ធ្មេញ', en: 'Tooth' },
  { kh: 'តម្លៃ', en: 'Price' },
  { kh: 'លើ', en: 'Upper' },
  { kh: 'ក្រោម', en: 'Lower' },
  { kh: 'ចំនួន', en: 'Number' },
  { kh: 'សកម្មភាព', en: 'Actions' },
];

export const OVERVIEW_PATIENT_HEADER: TableHeader[] = [
  { kh: 'ល.រ', en: 'No' },
  { kh: 'ឈ្មោះ', en: 'Name' },
  { kh: 'អត្តសញ្ញាណ', en: 'Identity' },
  { kh: 'អាយុ', en: 'Age' },
  { kh: 'ភេទ', en: 'Gender' },
  { kh: 'សាខា', en: 'Branch' },
];
