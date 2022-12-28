import moment from 'moment';
import filtersReducer from '../../reducers/filters';

test('Should set default values', () => {
    const reducer = filtersReducer(undefined, {type: '@@INIT'});
    expect(reducer).toEqual({
            text: '', 
            sortBy: 'date',
            startDate: moment().startOf('month'), 
            endDate: moment().endOf('month')
    });
});

test('Should set sortBy to amount', () => {
    const reducer = filtersReducer(undefined, {type: 'SORT_AMOUNT'});
    expect(reducer).toEqual({
            text: '', 
            sortBy: 'amount',
            startDate: moment().startOf('month'), 
            endDate: moment().endOf('month')
    });
});

test('Should set sortBy to DATE', () => {
    const currState = {
        text: '', 
        sortBy: 'amount',
        startDate: undefined, 
        endDate: undefined
    };
    const action = { type: 'SORT_DATE'};
    const reducer = filtersReducer(undefined, action);
    expect(reducer.sortBy).toBe('date');
});

test('Should set textFilter to XvX', () => {
    const action = { type: 'SET_TEXT_FILTER', text: 'XvX'};
    const reducer = filtersReducer(undefined, action);
    expect(reducer.text).toBe('XvX');
});

test('Should set startDate to moment + 3 days', () => {
    const action = { type: 'SET_START_DATE', startDate: moment(0)};
    const reducer = filtersReducer(undefined, action);
    expect(reducer.startDate).toEqual(moment(0));
});

test('Should set endDate to moment - 3 days', () => {
    const action = { type: 'SET_END_DATE', endDate: moment(0)};
    const reducer = filtersReducer(undefined, action);
    expect(reducer.endDate).toEqual(moment(0));
});