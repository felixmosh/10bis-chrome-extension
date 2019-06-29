import { boundMethod } from 'autobind-decorator';
import { Component, h } from 'preact';
import { IOptions } from '../../types/types';
import { DEFAULT_OPTIONS } from '../constants/constants';
import { chromeService } from '../popup/services/chrome';
import s from './OptionsApp.scss';

export class OptionsApp extends Component<any, IOptions> {
  public async componentDidMount() {
    const options = await chromeService.getSyncItem();
    this.setState({ ...DEFAULT_OPTIONS, ...options });
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit} className={s.form}>
        <fieldset>
          <legend>הגדרות:</legend>
          <label for="refLine">גובה קו ייחוס:</label>
          <input
            type="number"
            min="0"
            name="refLine"
            id="refLine"
            value={this.state.refLine}
            onInput={this.handleInputChange}
          />
          <div className={s.buttonWrapper}><button type="submit">שמור</button></div>
        </fieldset>
      </form>
    );
  }

  @boundMethod
  private async handleSubmit(e) {
    e.preventDefault();

    await chromeService.setSyncItem<IOptions>(this.state);
  }

  @boundMethod
  private handleInputChange(e) {
    const {
      target: { name, value, type }
    } = e;

    this.setState({
      [name]: type === 'number' ? parseInt(value || 0, 10) : value
    });
  }
}
