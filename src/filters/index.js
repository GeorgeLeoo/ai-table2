export const formatMoney = (val) => {
  if (!val) {
    return ''
  }
  val = Number(val).toFixed(2) * 100 + ''
  val = val.replaceAll('-', '')
  val = val.replaceAll('-0', '')
  if (val[0] && val[0] === '0') {
    val = val.substring(1, val.length)
  }
  return val
}
