const sendToCaaS = async (_, sk) => {
  const SCRIPT_ID = 'send-caas-listener';
  const dispatchEvent = () => document.dispatchEvent(
    new CustomEvent('send-to-caas', {
      detail: {
        host: sk.config.host,
        project: sk.config.project,
        branch: sk.config.ref,
        repo: sk.config.repo,
        owner: sk.config.owner,
      },
    }),
  );

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.src = '/tools/send-to-caas/sendToCaasEventListener.js';
    script.id = SCRIPT_ID;
    script.onload = () => dispatchEvent();
    document.head.appendChild(script);
  } else {
    dispatchEvent();
  }
};

export default sendToCaaS;
