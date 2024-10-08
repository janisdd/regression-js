
A fork for my own purposes

the main differences are:

- (3.0.0)
  - js is now typescript
  - excluded all interpolations other than linear
  - added `linearBig` that uses `big.js` for everything
    - default is max precision `20`
  - uses vite for bundling

TODO add tests for `linearBig`

TODO currently `yarn build` and `yarn buildMini` will clear the `dist`, so we do not build normal and minified in one go

---

# regression-js

regression-js is a JavaScript module containing a collection of linear least-squares fitting methods for simple data analysis.

## Installation
This module works on node and in the browser. It is available as the 'regression' package on [npm](https://www.npmjs.com/package/regression). It is also available on a [CDN](https://cdnjs.com/libraries/regression).

### npm

```
npm install --save regression
```

## Usage

```javascript
import regression from 'regression';
const result = regression.linear([[0, 1], [32, 67], [12, 79]]);
const gradient = result.equation[0];
const yIntercept = result.equation[1];
```

Data is passed into the model as an array. A second parameter can be used to configure the model. The configuration parameter is optional. `null` values are ignored. The precision option will set the number of significant figures the output is rounded to.

### Configuration options
Below are the default values for the configuration parameter.
```javascript
{
  order: 2,
  precision: 2,
}
```

### Properties
- `equation`: an array containing the coefficients of the equation
- `string`: A string representation of the equation
- `points`: an array containing the predicted data in the domain of the input
- `r2`: the coefficient of determination (<i>R</i><sup>2</sup>)
- `predict(x)`: This function will return the predicted value

## API

### `regression.linear(data[, options])`
Fits the input data to a straight line with the equation ![y = mx + c](http://mathurl.com/ycqyhets.png). It returns the coefficients in the form `[m, c]`.

### `regression.exponential(data[, options])`
Fits the input data to a exponential curve with the equation ![y = ae^bx](http://mathurl.com/zuys53z.png). It returns the coefficients in the form `[a, b]`.

### `regression.logarithmic(data[, options])`
Fits the input data to a logarithmic curve with the equation ![y = a + b ln x](http://mathurl.com/zye394m.png). It returns the coefficients in the form `[a, b]`.

### `regression.power(data[, options])`
Fits the input data to a power law curve with the equation ![y = ax^b](http://mathurl.com/gojkazs.png). It returns the coefficients in the form `[a, b]`.

### `regression.polynomial(data[, options])`
Fits the input data to a polynomial curve with the equation ![anx^n ... + a1x + a0](http://mathurl.com/hxz543o.png). It returns the coefficients in the form `[an..., a1, a0]`. The order can be configure with the `order` option.

#### Example

```javascript
const data = [[0,1],[32, 67] .... [12, 79]];
const result = regression.polynomial(data, { order: 3 });
```

## Development

- Install the dependencies with `npm install`
- To build the assets in the `dist` directory, use `npm run build`
- You can run the tests with: `npm run test`.
