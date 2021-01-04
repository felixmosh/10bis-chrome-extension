import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { IAppState, IReduxProps } from '../../types/types';
import styles from './App.scss';
import { Header } from './components/Header/Header';
import { Stats } from './components/Stats/Stats';
import { loadOptions } from './store/actions/options';
import { restoreLogin } from './store/actions/user';

interface IAppProps extends IReduxProps, Partial<IAppState> {}

@(connect((s: IAppState) => s) as any)
export class App extends Component<IAppProps, {}> {
  public componentWillMount() {
    const { dispatch } = this.props;
    dispatch(loadOptions());
    dispatch(restoreLogin());
  }

  public render() {
    const { user } = this.props;
    return (
      <div className={styles.app}>
        <Header firstname={user.firstname} lastname={user.lastname} />
        <main className={styles.main}>{this.renderContent()}</main>
      </div>
    );
  }

  private renderContent() {
    const { user } = this.props;
    if (user.isRestoreLoginInProgress) {
      return <div className={styles.textAlign}>טוען...</div>;
    } else {
      if (!user.isLoginInProgress && !!user.id) {
        return <Stats />;
      } else {
        return (
          <p className={styles.textAlign}>
            אנא התחברו לאתר <a href="https://www.10bis.co.il">תן-ביס</a>
          </p>
        );
      }
    }
  }
}
