import Big, {RoundingMode} from 'big.js'

type DataPoint = number[] // [number, number]
type DataPointBig = Big[] // [Big, Big]

const DEFAULT_OPTIONS = {
  precision: 2,
  precisionBig: 20, //default for Big.DP https://mikemcl.github.io/big.js/#dp
  predictPoints: false,
  bigRoundingMode: 1 satisfies typeof Big.roundHalfUp
}

/**
 * Round a number to a precision, specified in number of decimal places
 *
 * @param {number} number - The number to round
 * @param {number} precision - The number of decimal places to round to:
 *                             > 0 means decimals, < 0 means powers of 10
 *
 *
 * @return {number} - The number, rounded
 */
function round(number: number, precision: number) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor
}

function roundBig(number: Big, precision: number, roundingMode: RoundingMode): Big {
  return number.round(precision, Big.roundHalfUp)
}

function _linear(data: DataPoint[], options: typeof DEFAULT_OPTIONS) {
  const sum = [0, 0, 0, 0, 0]
  let len = 0

  for (let n = 0; n < data.length; n++) {
    if (data[n][1] !== null) {
      len++
      sum[0] += data[n][0]
      sum[1] += data[n][1]
      sum[2] += data[n][0] * data[n][0]
      sum[3] += data[n][0] * data[n][1]
      sum[4] += data[n][1] * data[n][1]
    }
  }

  const run = ((len * sum[2]) - (sum[0] * sum[0]))
  const rise = ((len * sum[3]) - (sum[0] * sum[1]))
  const gradient = run === 0
                   ? 0
                   : round(rise / run, options.precision)
  const intercept = round((sum[1] / len) - ((gradient * sum[0]) / len), options.precision)

  const predict = (x: number) => ([
      round(x, options.precision),
      round((gradient * x) + intercept, options.precision)]
  );

  return {
    points: options.predictPoints
            ? data.map(point => predict(point[0]))
            : [],
    predict,
    equation: [gradient, intercept],
    string: intercept === 0
            ? `y = ${gradient}x`
            : `y = ${gradient}x + ${intercept}`,
  }
}

function _linearBig(data: DataPointBig[], options: typeof DEFAULT_OPTIONS) {
  const sum: [Big, Big, Big, Big, Big] = [Big(0), Big(0), Big(0), Big(0), Big(0)]

  let len = Big(0)

  for (let n = 0; n < data.length; n++) {
    if (data[n][1] !== null) {
      len = len.add(1)
      sum[0] = sum[0].add(data[n][0])
      sum[1] = sum[1].add(data[n][1])
      sum[2] = sum[2].add(data[n][0].mul(data[n][0]))
      sum[3] = sum[3].add(data[n][0].mul(data[n][1]))
      sum[4] = sum[4].add(data[n][1].mul(data[n][1]))
    }
  }

  const run = ((len.mul(sum[2])).minus(sum[0].mul(sum[0])))
  const rise = ((len.mul(sum[3])).minus(sum[0].mul(sum[1])))

  const zero = Big(0)

  const gradient = run.cmp(zero) === 0
                   ? zero
                   : roundBig(rise.div(run), options.precision, options.bigRoundingMode as RoundingMode)

  const intercept = roundBig((sum[1].div(len)).sub((gradient.mul(sum[0])).div(len)), options.precision, options.bigRoundingMode as RoundingMode)


  const predict = (x: Big) => ([
      roundBig(x, options.precision, options.bigRoundingMode as RoundingMode),
      roundBig((gradient.mul(x)).add(intercept), options.precision, options.bigRoundingMode as RoundingMode)]
  )

  return {
    points: options.predictPoints
            ? data.map(point => predict(point[0]))
            : [],
    predict,
    equation: [gradient, intercept],
    string: intercept.cmp(zero) === 0
            ? `y = ${gradient}x`
            : `y = ${gradient}x + ${intercept}`,
  };
}

export default {
  linear: (data: DataPoint[], options?: typeof DEFAULT_OPTIONS) => {
    return _linear(data, {
      ...DEFAULT_OPTIONS,
      ...options,
    })
  },
  linearBig: (data: DataPointBig[], options?: typeof DEFAULT_OPTIONS) => {
    return _linearBig(data, {
      ...DEFAULT_OPTIONS,
      ...options,
    })
  }
}


