// utils/formatNumber.js
export function formatNumberWithCommas(value) {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  export function removeCommas(value) {
    if (!value) return '';
    return value.toString().replace(/,/g, '');
  }
  