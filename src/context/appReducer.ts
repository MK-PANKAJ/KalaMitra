import { AppState, AppAction } from '../types';
import { generateDemoData } from '../utils/demoData';

export const initialState: AppState = {
  user: null,
  products: [],
  orders: [],
  disputes: [],
  governmentSchemes: [],
  reviews: [],
  messages: [],
  conversations: [],
  isListening: false,
  isSpeaking: false,
  currentLanguage: 'en',
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        currentLanguage: action.payload.language,
      };

    case 'LOGOUT':
      return {
        ...initialState,
      };

    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload,
        user: state.user ? { ...state.user, language: action.payload } : null,
      };

    case 'CLEAR_DATA':
      return {
        ...state,
        products: [],
        orders: [],
        disputes: [],
        governmentSchemes: [],
        reviews: [],
        messages: [],
        conversations: [],
      };

    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, ...action.payload.updates } : o
        ),
      };

    case 'ADD_MILESTONE':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.orderId
            ? { ...o, milestones: [...o.milestones, action.payload.milestone] }
            : o
        ),
      };

    case 'ADD_GOVERNMENT_SCHEME':
      return {
        ...state,
        governmentSchemes: [...state.governmentSchemes, action.payload],
      };

    case 'UPDATE_GOVERNMENT_SCHEME':
      return {
        ...state,
        governmentSchemes: state.governmentSchemes.map(scheme =>
          scheme.id === action.payload.id ? { ...scheme, ...action.payload.updates } : scheme
        ),
      };

    case 'DELETE_GOVERNMENT_SCHEME':
      return {
        ...state,
        governmentSchemes: state.governmentSchemes.filter(scheme => scheme.id !== action.payload),
      };

    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };

    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              wishlist: [...(state.user.wishlist || []), action.payload],
            }
          : null,
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              wishlist: (state.user.wishlist || []).filter(id => id !== action.payload),
            }
          : null,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'SET_LISTENING':
      return {
        ...state,
        isListening: action.payload,
      };

    case 'SET_SPEAKING':
      return {
        ...state,
        isSpeaking: action.payload,
      };

    case 'LOAD_DEMO_DATA':
      const demoData = generateDemoData();
      return {
        ...state,
        products: demoData.products,
        orders: demoData.orders,
        disputes: demoData.disputes,
        governmentSchemes: demoData.governmentSchemes || [],
        reviews: demoData.reviews || [],
      };

    default:
      return state;
  }
};
