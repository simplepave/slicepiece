<?php if (!defined('DIR_SYSTEM')) exit('No direct script access allowed');

class ControllerMailBuyOneClick extends Controller {

    public function index()
    {
        if ($this->request->server['REQUEST_METHOD'] == 'POST' && $this->request->post['action'] == 'buy_one_click') {

            $sp_valid = new SP_Validation();

            $sp_valid->validation([
                'firstname'  => 'bail|required|min:3|max:32',
                'telephone'  => 'bail|required|phone:format|max:25',
                'product_id' => 'bail|required|numeric|type:int',
            ]);

            $json = [
                'status'   => 0,
                'message'  => 'Ошибка, обратитесь к администратору!',
            ];

            if ($sp_valid->status) {
                $fields = $sp_valid->get_fields('all');

                $data['firstname'] = 'Имя: ' . $fields['firstname'];
                $data['telephone'] = 'Tel: ' . $fields['telephone'];

                $this->load->model('catalog/product');
                $product = $this->model_catalog_product->getProduct($fields['product_id']);

                if ($product) {
                    $data['product'] = [
                        'name' => 'Товар: "' . $product['name'] . '"',
                        'href' => 'Ссылка: ' . str_replace('&amp;', '&', $this->url->link('product/product', 'product_id=' . $product['product_id'])),
                    ];

                    if ($this->customer->isLogged()) {
                        $firstname = $this->customer->getFirstName()?: '';
                        $lastname = $this->customer->getLastName()?: '';

                        $data['customer'] = $firstname || $lastname? 'Покупатель: ' . $firstname . ' ' . $lastname: false;
                    }

                    $mail = new Mail($this->config->get('config_mail_engine'));
                    $mail->parameter = $this->config->get('config_mail_parameter');
                    $mail->smtp_hostname = $this->config->get('config_mail_smtp_hostname');
                    $mail->smtp_username = $this->config->get('config_mail_smtp_username');
                    $mail->smtp_password = html_entity_decode($this->config->get('config_mail_smtp_password'), ENT_QUOTES, 'UTF-8');
                    $mail->smtp_port = $this->config->get('config_mail_smtp_port');
                    $mail->smtp_timeout = $this->config->get('config_mail_smtp_timeout');

                    $mail->setTo($this->config->get('config_email'));
                    $mail->setFrom($this->config->get('config_email'));
                    $mail->setSender(html_entity_decode($this->config->get('config_name'), ENT_QUOTES, 'UTF-8'));
                    $mail->setSubject(html_entity_decode('Купить в один клик', ENT_QUOTES, 'UTF-8'));
                    $mail->setText($this->load->view('mail/buy_one_click', $data));
                    $mail->send();

                    $json = [
                        'status'   => 'success',
                        'message'  => 'Заказ принят в обработку!',
                    ];
                }
            }
            else
                $json = [
                    'status'  => 'error',
                    'message' => $sp_valid->get_errors(),
                ];

            $this->response->addHeader('Content-Type: application/json');
            $this->response->setOutput(json_encode($json));
        }
    }
}