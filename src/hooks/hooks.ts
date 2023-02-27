import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store/store';

type DispatchFunc = () => ThunkDispatch<RootState, unknown, AnyAction>;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
