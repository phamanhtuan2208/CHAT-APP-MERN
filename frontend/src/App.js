import Style from './App.module.scss';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import classNames from 'classnames/bind';

function App() {
    const cx = classNames.bind(Style);
    return (
        <div className={cx('App')}>
            <Route path="/" component={Homepage} exact />
            <Route path="/chats" component={ChatPage} />
        </div>
    );
}

export default App;
