import { h } from 'preact';
import styles from './MonthNavigation.scss';

interface IMonthNavigationProps {
  currentDate: Date;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const firstDayOfMonth = new Date();
firstDayOfMonth.setSeconds(0);
firstDayOfMonth.setMinutes(0);
firstDayOfMonth.setHours(0);
firstDayOfMonth.setDate(0);

export const MonthNavigation = ({
  currentDate,
  onClickNext,
  onClickPrev
}: IMonthNavigationProps) => {
  const isNextDisabled = currentDate.getTime() >= firstDayOfMonth.getTime();
  return (
    <nav className={styles.monthNavigation}>
      <button onClick={onClickPrev} className={styles.button}>
        ❮
      </button>
      <span>{currentDate.toLocaleDateString('he-IL', { month: 'long' })}</span>
      <button
        onClick={onClickNext}
        className={styles.button}
        disabled={isNextDisabled}
      >
        ❯
      </button>
    </nav>
  );
};
