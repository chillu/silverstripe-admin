import $ from 'jQuery';
import i18n from 'i18n';
import moment from 'moment';
import modernizr from 'modernizr';

require('../../../thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');

$.entwine('ss', (jQuery) => {
  jQuery('input[type=date]').entwine({
    onadd() {
      // Browser supports type=date natively
      if (modernizr.inputtypes.date) {
        return;
      }

      // disabled, readonly or already applied
      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }

      // Duplicate input field to store ISO value
      const hiddenInput = jQuery(
        '<input/>',
        { type: 'hidden', name: this.attr('name'), value: this.val() }
      );
      this.parent().append(hiddenInput);

      // Avoid original field being saved
      this.removeAttr('name');

      // Set localised value in original field
      moment.locale(this.attr('lang'));
      const isoDate = this.val();
      let localDate = '';
      if (isoDate) {
        const dateObject = moment(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format('L');
        }
      }
      this.val(localDate);

      // Set useful localised placeholder
      const placeholder = i18n.inject(
        i18n._t('DateField.DateFormatExample', 'Example: {date}'),
        { date: moment().endOf('month').format('L') }
      );
      this.attr('placeholder', placeholder);

      this.updateValue();
    },
    onchange() {
      // TODO Validation
      this.updateValue();
    },
    updateValue() {
      const localDate = this.val();
      let isoDate = '';
      if (localDate) {
        for (const format of ['L', 'YYYY-MM-DD']) {
          const dateObject = moment(localDate, format);
          if (dateObject.isValid()) {
            isoDate = dateObject.format('YYYY-MM-DD');
            break;
          }
        }
      }
      this.parent().find('input[type=hidden]').val(isoDate);
    },
  });
});
