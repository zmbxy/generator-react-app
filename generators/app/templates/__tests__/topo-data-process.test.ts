import fullData from '../src/views/situation/full-data';
import { transform2Graph, processException } from '../src/views/situation/utils/data-procecss';

test('process full route data', () => {
  const data = transform2Graph(fullData);
  const { graphData, exception } = data;
  expect(graphData?.nodes.length).toBe(fullData.allRoute?.nodes.length);
  expect(graphData?.edges.length).toBe(fullData.allRoute?.edges.length);
  expect(exception.exceptionMap.size).not.toBe(0);
  expect(exception.nodeStateMap.size).not.toBe(0);
  expect(exception.loopEdgeMap.size).not.toBe(0);
});

test('process inc data', () => {

})

export {};
