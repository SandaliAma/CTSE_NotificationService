import notificationRoutes from '../routes/notificationRoutes';
import notifyRoutes from '../routes/notifyRoutes';

describe('routes', () => {
  it('notificationRoutes should have GET and DELETE routes', () => {
    const routes = notificationRoutes.stack.map((r: any) => ({
      method: Object.keys(r.route.methods)[0],
      path: r.route.path,
    }));
    expect(routes).toContainEqual({ method: 'get', path: '/' });
    expect(routes).toContainEqual({ method: 'delete', path: '/:id' });
  });

  it('notifyRoutes should have POST /send and POST /broadcast', () => {
    const routes = notifyRoutes.stack.map((r: any) => ({
      method: Object.keys(r.route.methods)[0],
      path: r.route.path,
    }));
    expect(routes).toContainEqual({ method: 'post', path: '/send' });
    expect(routes).toContainEqual({ method: 'post', path: '/broadcast' });
  });
});
