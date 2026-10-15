// Tasks on the board. Sample agencies keep them in the page; live agencies' tasks are saved in the database. Each
// change shows at once and is saved in the background. If saving fails, the board goes back to what is saved and a
// notice says so. Tasks are { id, title, desc, client (name), status, due (label), dueDay, who (people keys), items
// (checklist labels), chk (ticked), sub ([ticked, total]), comments ([who, when, text]), cm (comment count) }.
import { addTaskCommentAction, createTaskAction, deleteTaskAction, updateTaskAction } from '@/app/actions/tasks';
import { fmtDay } from '../../metrics';
import { DEF_TASKS, PEOPLE } from '../../data';

const COLORS = ['#d6e4f8', '#fde2c8', '#d4f0dd', '#fff6c2', '#fde2d6', '#e6ebf2'];
const initials = n => (n || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

// Who can be put on a task: the team (live) or the sample people, as { key: [name, avatar colour] }.
export const peopleOf = (live, members) => !live ? PEOPLE : Object.fromEntries((members || []).filter(m => m.id && !m.pending).map((m, k) => [m.id, [m.name, COLORS[k % COLORS.length]]]));
// One person's avatar: initials, name and colour. Someone who left the team still shows on old tasks and comments.
export const personOf = (P, key) => P[key] ? { i: P[key] === PEOPLE[key] ? key : initials(P[key][0]), name: P[key][0], bg: P[key][1] } : { i: '?', name: 'Former teammate', bg: '#e6ebf2' };

const ago = iso => { const s = (Date.now() - Date.parse(iso)) / 1000, d = Math.floor(s / 86400);
  return s < 60 ? 'Just now' : s < 3600 ? Math.floor(s / 60) + ' min ago' : s < 86400 ? Math.floor(s / 3600) + ' h ago' : d === 1 ? 'Yesterday' : d < 7 ? d + ' days ago' : fmtDay(iso.slice(0, 10)); };

// The saved tasks in the board's shape.
export const tasksOf = (live, C) => !live ? DEF_TASKS : (live.tasks || []).map(t => ({ id: t.id, title: t.title, desc: t.desc, status: t.status,
  client: (C.find(c => c.extra && c.extra.id === t.clientId) || {}).name || '', due: t.dueDay ? fmtDay(t.dueDay) : '', dueDay: t.dueDay, who: t.who,
  items: t.items.map(x => x.label), chk: t.items.map(x => x.done), sub: [t.items.filter(x => x.done).length, t.items.length],
  comments: t.comments.map(c => [c.who, ago(c.at), c.text]), cm: t.comments.length }));

// The Friday of this week (or next week from Saturday), for tasks due "this week".
export const thisFriday = () => { const d = new Date(); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7)); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

export function taskOps(app, { live, C, defTasks }) {
  const list = s => s.tasks || defTasks;
  const set = fn => app.setState(s => { const arr = list(s).map(t => ({ ...t })); fn(arr); return { tasks: arr, tkMenu: null }; });
  const fail = msg => { clearTimeout(app.tkT); app.setState({ tasks: null, tkToast: msg }); app.tkT = setTimeout(() => app.setState({ tkToast: null }), 6000); };
  const save = (p, what) => p.then(x => { if (x && x.error) fail(x.error); return x; }, () => fail('Couldn’t save ' + what + '. Check your connection and try again.'));
  // A task added a moment ago gets its id when the server answers; changes to it wait for that.
  const pending = app._tkPending || (app._tkPending = {});
  const idOf = t => pending[t.key] || Promise.resolve(t.id);
  const clientId = name => (C.find(c => c.name === name && c.extra) || { extra: {} }).extra.id || null;
  const itemsOf = t => (t.items || []).map((label, j) => ({ label, done: !!(t.chk || [])[j] }));
  return {
    // t: { title, desc, client, status, due, dueDay, who, items }. at: 'top' of the board or 'bottom' of its column.
    create(t, at = 'top') {
      const key = 'new' + Date.now() + Math.random().toString(36).slice(2, 6), items = t.items || [];
      const task = { desc: '', client: '', status: 'todo', due: '', who: [], cm: 0, comments: [], ...t, key, items, chk: items.map(() => false), sub: [0, items.length] };
      set(arr => at === 'top' ? arr.unshift(task) : arr.push(task));
      if (!live) return;
      pending[key] = save(createTaskAction({ title: task.title, desc: task.desc, clientId: clientId(task.client), status: task.status, due: task.dueDay || null, assignees: task.who, items: itemsOf(task), at }), 'the task')
        .then(x => (x && x.id) || null);
    },
    // Moving to Done ticks the whole checklist.
    move(i, status) {
      const t = list(app.state)[i]; if (!t) return;
      const chk = status === 'done' && t.items && t.items.length ? t.items.map(() => true) : null;
      set(arr => { arr[i].status = status; arr[i].done = status === 'done'; if (status === 'done' && arr[i].sub) arr[i].sub = [arr[i].sub[1], arr[i].sub[1]]; if (chk) arr[i].chk = chk; });
      if (live) idOf(t).then(id => id && save(updateTaskAction({ id, status, ...(chk ? { items: itemsOf({ ...t, chk }) } : {}) }), 'the change'));
    },
    // The checklist: labels and which are ticked.
    check(i, names, chk) {
      const t = list(app.state)[i]; if (!t) return;
      set(arr => { arr[i].items = names; arr[i].chk = chk; arr[i].sub = [chk.filter(Boolean).length, chk.length]; });
      if (live) idOf(t).then(id => id && save(updateTaskAction({ id, items: itemsOf({ items: names, chk }) }), 'the checklist'));
    },
    remove(i) {
      const t = list(app.state)[i]; if (!t) return;
      set(arr => arr.splice(i, 1));
      if (live) idOf(t).then(id => id && save(deleteTaskAction({ id }), 'the change'));
    },
    comment(i, who, text, shown) {
      const t = list(app.state)[i]; if (!t) return;
      const next = [...shown, [who, 'Just now', text]];
      set(arr => { arr[i].comments = next; arr[i].cm = next.length; });
      if (live) idOf(t).then(id => id && save(addTaskCommentAction({ taskId: id, body: text }), 'the comment'));
    },
  };
}
