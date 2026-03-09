// 嵌入式数据模块 - 将 proteam.xlsx 数据直接嵌入到应用中
import * as XLSX from 'xlsx';
import workbookData from './workbookData.json';

// 从 JSON 数据重建 workbook 对象
function createWorkbookFromData(data) {
  const workbook = {
    SheetNames: data.SheetNames,
    Sheets: {}
  };

  data.SheetNames.forEach(sheetName => {
    const sheetData = data.Sheets[sheetName].data;
    // 从二维数组创建 worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    workbook.Sheets[sheetName] = worksheet;
  });

  return workbook;
}

// 创建并缓存 workbook
let cachedWorkbook = null;

export function getEmbeddedWorkbook() {
  if (!cachedWorkbook) {
    cachedWorkbook = createWorkbookFromData(workbookData);
  }
  return cachedWorkbook;
}

export default getEmbeddedWorkbook;