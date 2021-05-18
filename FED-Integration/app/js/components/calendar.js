import Calendar from 'tui-calendar';
import { Modal } from './modal';
import $script from 'scriptjs';

const calendarDiv = document.getElementById('calendar');
if (calendarDiv) {
    var calendar = new Calendar('#calendar', {
        defaultView: 'month',
        taskView: true,
        template: {
          monthDayname: function(dayname) {
            return '<span class="calendar-week-dayname-name">' + dayname.label + '</span>';
          }
        }
    });
    
    setRenderRangeText();
    
    const calendarPrevs = document.querySelectorAll('.js-calendar-prev');
    if (calendarPrevs.length) {
        calendarPrevs.forEach((calendarPrev) => {
            calendarPrev.addEventListener('click', function(event) {
                event.preventDefault();
                calendar.prev();
                setRenderRangeText();
            });
        });
    }
    
    const calendarNexts = document.querySelectorAll('.js-calendar-next');
    if (calendarNexts.length) {
        calendarNexts.forEach((calendarNext) => {
            calendarNext.addEventListener('click', function(event) {
                event.preventDefault();
                calendar.next();
                setRenderRangeText();
            });
        });
    }
    
    const calendarTodays = document.querySelectorAll('.js-calendar-today');
    if (calendarTodays.length) {
        calendarTodays.forEach((calendarToday) => {
            calendarToday.addEventListener('click', function(event) {
                event.preventDefault();
                calendar.today();
                setRenderRangeText();
            });
        });
    }
    
    calendar.createSchedules([
        {
            id: '1',
            calendarId: '1',
            title: 'Gestion management du centre',
            category: 'time',
            dueDateClass: '',
            start: '2021-05-12T08:30:00+09:00',
            end: '2021-05-13T18:30:00+09:00'
        },
        {
            id: '2',
            calendarId: '2',
            title: 'Psychologie de l\'enfant',
            category: 'time',
            dueDateClass: '',
            start: '2021-05-26T17:30:00+09:00',
            end: '2021-05-28T17:31:00+09:00',
            isReadOnly: false
        },
        {
            id: '3',
            calendarId: '3',
            title: 'Puériculture',
            category: 'time',
            dueDateClass: '',
            start: '2021-05-17T17:30:00+09:00',
            end: '2021-05-21T17:31:00+09:00',
            isReadOnly: false
        }
    ]);
    
    calendar.on({
        'clickSchedule': function(e) {
            console.log('clickSchedule', e);
            const modal = new Modal();
            modal.open(document.querySelector(".js-calendar-modal-container-details").innerHTML, 'big');
        },
        'beforeCreateSchedule': function(e) {
            console.log('beforeCreateSchedule', e);
            const modal = new Modal();
            modal.open(document.querySelector(".js-calendar-modal-container-update").innerHTML, 'big');
        },
        'beforeUpdateSchedule': function(e) {
            console.log('beforeUpdateSchedule', e);
            e.schedule.start = e.start;
            e.schedule.end = e.end;
            calendar.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
        },
        'beforeDeleteSchedule': function(e) {
            console.log('beforeDeleteSchedule', e);
            calendar.deleteSchedule(e.schedule.id, e.schedule.calendarId);
        }
    });
    
    function setRenderRangeText() {
        $script('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js', () => {
            var renderRange = document.querySelector('.js-calendar-range');
            var options = calendar.getOptions();
            var viewName = calendar.getViewName();
            var html = [];
            if (viewName === 'day') {
                html.push(moment(calendar.getDate().getTime()).format('MMM YYYY DD'));
            } else if (viewName === 'month' &&
                (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
                html.push(moment(calendar.getDate().getTime()).format('MMM YYYY'));
            } else {
                html.push(moment(calendar.getDateRangeStart().getTime()).format('MMM YYYY DD'));
                html.push(' ~ ');
                html.push(moment(calendar.getDateRangeEnd().getTime()).format(' MMM DD'));
            }
            renderRange.innerHTML = html.join('');
        });
    }

    document.addEventListener('click', (e) => {
        const elem = e.target;

        /* Click on Update Icon */
        if (elem.classList.contains('js-update-calendar')) {
            const modal = new Modal();
            modal.open(document.querySelector(".js-calendar-modal-container-update").innerHTML, 'big');
        }

        /* Click on Delete Icon */
        if (elem.classList.contains('js-delete-calendar')) {
            const modal = new Modal();
            modal.open(document.querySelector(".js-calendar-modal-container-confirm").innerHTML, 'big');
        }

        /* Click on Delete Icon */
        if (elem.classList.contains('js-confirm-delete-calendar')) {
            const modal = new Modal();
            modal.close();
        }
        
    });
}
