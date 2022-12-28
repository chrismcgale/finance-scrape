import moment from 'moment';
import expenseReducer from '../../reducers/expenses';
import expenses from '../fixtures/expenses';

test('Should set default state', () => {
    const state = expenseReducer(undefined, {type: '@@INIT'});
    expect(state).toEqual([]);
});

test('Valid Remove from Reducer', () => {
    const action = {
        type: 'REMOVE_EXPENSE',
        id: '2'
    }
    const state = expenseReducer(expenses, action);
    expect(state).toEqual([expenses[0], expenses[2]]);
});

test('Invalid Remove from Reducer', () => {
    const action = {
        type: 'REMOVE_EXPENSE',
        id: '-1'
    }
    const state = expenseReducer(expenses, action);
    expect(state).toEqual([expenses[0], expenses[1], expenses[2]]);
});

test('Add expense from Reducer', () => {
    const newExpense = {
        id: '4',
        description: 'Gas',
        amount: 300,
        note: '',
        createdAt: moment(0)
    }
    const action = {
        type: 'ADD_EXPENSE',
        expense: newExpense
    }
    const state = expenseReducer(expenses, action);
    expect(state).toEqual([expenses[0], expenses[1], expenses[2], newExpense]);
});

test('Edit from Reducer', () => {
    const newExpense = {
        id: '4',
        description: 'Gas',
        amount: 300,
        note: '',
        createdAt: moment(0)
    }
    const action = {
        type: 'EDIT_EXPENSE',
        id: '1',
        updates: newExpense
    }
    const state = expenseReducer(expenses, action);
    expect(state).toEqual([newExpense, expenses[1], expenses[2]]);
});