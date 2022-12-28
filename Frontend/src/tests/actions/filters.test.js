import moment from 'moment'
import { 
    setStartDate, 
    setEndDate, 
    setTextFilter, 
    sortByAmount,
    sortByDate
} from "../../actions/filters"

test('Set start date', () => {
    const action = setStartDate(moment(0));
    expect(action).toEqual({
        type: 'SET_START_DATE',
        startDate: moment(0)
    });
});

test('Set start date', () => {
    const action = setEndDate(moment(0));
    expect(action).toEqual({
        type: 'SET_END_DATE',
        endDate: moment(0)
    });
});

test('Should generate set text filter', () => {
    const text = 'Something';
    const action = setTextFilter(text);
    expect(action).toEqual({
        type: 'SET_TEXT_FILTER',
        text
    });
});

test('Default set text', () => {
    const action = setTextFilter();
    expect(action).toEqual({
        type: 'SET_TEXT_FILTER',
        text: ''  
    });
});

test('Sort by date action object', () => {
    const action = sortByDate();
    expect(action).toEqual({
        type: 'SORT_DATE'
    });
});

test('Sort by amount action object', () => {
    const action = sortByAmount();
    expect(action).toEqual({
        type: 'SORT_AMOUNT'
    });
});