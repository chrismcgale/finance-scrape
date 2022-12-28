import { addExpense, removeExpense, editExpense } from '../../actions/expenses';

test('Should setup remove action object', () => {
    const action = removeExpense({ id: '123abs' });
    expect(action).toEqual({
        type: 'REMOVE_EXPENSE',
        id: '123abs'
    });
});

test('Should setup edit action object', () => {
    const action = editExpense( '123abs', { note: 'New Note Val' } );
    expect(action).toEqual({
        type: 'EDIT_EXPENSE',
        id: '123abs',
        updates: {
            note: 'New Note Val'
        }
    });
});

test('Should setup add action object with provided values', () => { 
    const expenseData = {
        description: 'Rent',
        amount: 1000,
        createdAt: 1001,
        note: 'Last months rent'
    }
    const action = addExpense(expenseData)
    expect(action).toEqual({
        type: 'ADD_EXPENSE',
        expense: {
            ...expenseData,
            id: expect.any(String)
        }
    });
});

test('Should setup add action object with default values', () => { 
    const action = addExpense()
    expect(action).toEqual({
        type: 'ADD_EXPENSE',
        expense: {
            description: '', 
            note: '', 
            amount: 0, 
            createdAt: 0,
            id: expect.any(String)
        }
    });
});
