getPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    
    const project = await ProjectManagement.findById(projectId).select('payment_status stripe_payment_intent_id');
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    let stripeStatus = null;
    if (project.stripe_payment_intent_id) {
      const session = await this.stripe.checkout.sessions.retrieve(project.stripe_payment_intent_id);
      stripeStatus = session.payment_status;
    }

    res.json({
      payment_status: project.payment_status,
      stripe_status: stripeStatus,
    });
  });