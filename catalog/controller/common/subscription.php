<?php

class ControllerCommonSubscription extends Controller {

	public function index()
    {
        if ($this->request->server['REQUEST_METHOD'] == 'POST' && $this->request->post['action'] == 'subscription') {
            $this->load->model('account/customer');

            $sp_valid = new SP_Validation();

            $sp_valid->validation([
                'email'    => 'bail|required|email|max:96',
            ]);

            $json = [
                'status'   => 0,
                'message'  => 'Ошибка, обратитесь к администратору!',
            ];

            if ($sp_valid->status) {
                $fields = $sp_valid->get_fields();
                $email = $fields['all']['email'];

                $customer = $this->model_account_customer->getCustomerByEmail($email);

                if ($customer) {
                    $this->model_account_customer->subscriptionNewsletter($customer['customer_id']);
                    $message = 'Ваша подписка успешно обновлена!';
                }
                else {
                    $password = random_password();

                    $fields = [
                        'firstname'  => '',
                        'lastname'   => '',
                        'telephone'  => '',
                        'email'      => $email,
                        'password'   => $password,
                        'newsletter' => 1,
                    ];

                    $customer_id = $this->model_account_customer->addCustomer($fields);

                    /* Clear any previous login attempts for unregistered accounts. */
                    $this->model_account_customer->deleteLoginAttempts($email);

                    $this->customer->login($email, $password);

                    unset($this->session->data['guest']);

                    $message  = 'Ваша подписка успешно добавлена!';
                    $redirect = $this->url->link('account/account', '', true);
                }

                $json = [
                    'status'   => 'success',
                    'message'  => $message,
                    'redirect' => isset($redirect)? $redirect: '',
                ];
            }
            else
                $json = [
                    'status'  => 'error',
                    'message' => $sp_valid->get_errors(),
                ];

            $this->response->addHeader('Content-Type: application/json');
            $this->response->setOutput(json_encode($json));
        }

        else return $this->load->view('common/subscription');
	}
}