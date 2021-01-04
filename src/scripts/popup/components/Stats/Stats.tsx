import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { IAppState, IReduxProps, IUserDetails } from '../../../../types/types';
import { changeMonthBy, getStats } from '../../store/actions/stats';
import { Balance } from '../Balance/Balance';
import { MonthlyExpense } from '../MonthlyExpense/MonthlyExpense';
import { MonthNavigation } from '../MonthNavigation/MonthNavigation';

interface IStatsProps extends IReduxProps, Partial<IAppState> {}

@(connect((s: IAppState) => s) as any)
export class Stats extends Component<IStatsProps> {
  public componentDidMount() {
    const { user, dispatch } = this.props;
    dispatch(getStats(0, user as IUserDetails));
  }

  public render() {
    const { stats, options } = this.props;
    return (
      <div>
        <MonthNavigation
          currentDate={stats.fromDate}
          onClickPrev={this.onClickPrev}
          onClickNext={this.onClickNext}
        />
        <Balance stats={stats} />
        <MonthlyExpense stats={stats} options={options} />
      </div>
    );
  }

  private onClickPrev = () => {
    const { dispatch } = this.props;
    dispatch(changeMonthBy(-1));
  };

  private onClickNext = () => {
    const { dispatch } = this.props;
    dispatch(changeMonthBy(1));
  };
}
