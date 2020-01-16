/*---created by wanghan---*/

/*--------------搜索组件-------------*/
interface SearchField {
  type: string,
  label: string,
  value?: any,
  options?: any[],
  keyValue?: {
    label: string,
    value: string
  },
  min?: number,
  max?: number,
  step?: number,
  precision?: number,
  pickerOptions?: any
}

export type SearchFields = {
  [propName: string]: SearchField
}

/*--------------表单组件-------------*/
interface FormField {
  type: string,
  label: string,
  value?: any,
  required?: boolean,
  editDisabled?: boolean,
  options?: any[],
  keyValue?: {
    label: string,
    value: string
  },
  min?: number,
  max?: number,
  step?: number,
  precision?: number,
  width?: string,
}

export type FormFields = {
  [propName: string]: FormField;
}

/*--------------表格组件-------------*/
interface TableField {
  name: string,
  value: string,
  options?: {
    label: string,
    value: string
  }[],
  timeFormat?: string,
  width?: string,
  customTd?: boolean,
  func?: (value: any) => any

}

export type TableFields = TableField[]
