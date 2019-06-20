import * as classNames from 'classnames';
import { h } from 'preact';
import * as s from './Header.scss';
import user from '../../../../img/user.svg';

export interface IHeaderProps {
  firstname: string;
  lastname: string;
}

export const Header = ({ firstname = '', lastname = '' }: IHeaderProps) => {
  const fullname = `${firstname} ${lastname}`.trim();
  return (
    <header className={classNames(s.header, { [s.hasName]: fullname })}>
      {fullname && (
        <span>
          <img src={user} />
          שלום<strong>{fullname}</strong>
        </span>
      )}
    </header>
  );
};
