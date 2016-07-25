import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Block } from './block.d';

interface Props extends React.Props<Input> {
    active: boolean;
    block: Block;
    activeRow: number;
    charactersLeft: number;
    setActive: (active: boolean) => void;
    changeText: (text: string) => void;
}

interface Refs {
    [key: string]: (Element);
    textarea: any;
}

export class Input extends React.Component<Props, any> {
    public refs: Refs;

    constructor(props: Props) {
        super(props);

        document.addEventListener('click', this.onDocumentClick);
        setTimeout(this.setSelectedRow.bind(this));
    }

    public componentWillReceiveProps(props: Props) {
        this.props = props;

        if (props.activeRow !== this.getSelectedRow()) {
            this.setSelectedRow();
        }
    }

    private contains(container, element: HTMLElement): boolean {
        let containerElement = ReactDOM.findDOMNode(container);
        
        return containerElement.contains(element);
    }
    
    private onDocumentClick = (e: Event) => {
		if (!this.contains(this.refs.textarea, e.target as HTMLElement)) {
			this.props.setActive(false);
		}
    }

    private getSelectedRow(): number {
        const position = this.refs.textarea.selectionStart;
        return position <= this.props.block.firstRow.length ? 1 : 2;
    }

    private setSelectedRow() {
        const textarea = this.refs.textarea;

        if (this.props.activeRow === 1) {
            textarea.selectionStart = this.props.block.firstRow.length;
            textarea.selectionEnd = this.props.block.firstRow.length;
        } else {
            textarea.selectionStart = this.refs.textarea.textContent.length + 1;
        }
    }

    private getText() {
        return this.props.block.firstRow + '\n' + this.props.block.secondRow;
    }

    public changeText(e) {
        this.props.changeText(e.target.value);
    }

    public render() {
        return (
            <div className="card-panel">
                <div className="row valign-wrapper">
                    <div className="hide-on-small-only col m1">
                        <i className="material-icons">input</i>
                    </div>
                    <div className="center-align col s12 m12">
                        <div  className="input-field col">
                            <textarea
                                ref="textarea"
                                onClick={ () => this.props.setActive(true) }
                                onChange={ this.changeText.bind(this) }
                                value={ this.getText() }
                                id="textarea1"
                                className="materialize-textarea" />
                            <label
                                htmlFor="textarea1"
                                className={ (this.props.active || this.props.block.firstRow.length ? 'active' + (this.props.charactersLeft <= 3 ? ' active-red' : '') : '') }>
                                { !this.props.active && !this.props.block.firstRow.length ?
                                    <span>Start writing ...</span>
                                    :
                                    <span>{ this.props.charactersLeft } characters left</span>
                                }
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}