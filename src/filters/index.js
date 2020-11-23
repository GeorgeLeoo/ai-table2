export const formatMoney = (val) => {
  if (!val || !/\d+/.test(val)) {
    return ''
  }
  val = Number(val).toFixed(2) * 100 / 100
  val = val.toFixed(2) + ''
  const splits = val.split('.')
  if (splits[0] === '0') {
    val = splits[1]
  } else {
    val = val.replaceAll('.', '')
    val = val.replaceAll('-', '')
  }
  val = Number(val)
  return val
}

