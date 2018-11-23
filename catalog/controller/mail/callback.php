<?php if (!defined('DIR_SYSTEM')) exit('No direct script access allowed');

class ControllerMailCallback extends Controller {

    public function index()
    {
        if ($this->request->server['REQUEST_METHOD'] == 'POST' && $this->request->post['action'] == 'callback') {

            $sp_valid = new SP_Validation();

            $sp_valid->validation([
                'firstname'  => 'bail|required|min:3|max:32',
                'telephone'  => 'bail|required|phone:format|max:25',
            ]);

            $json = [
                'status'   => 0,
                'message'  => 'Ошибка, обратитесь к администратору!',
            ];

            if ($sp_valid->status) {
                $fields = $sp_valid->get_fields();
                $fields = $fields['all'];

                $data['firstname'] = 'Имя: ' . $fields['firstname'];
                $data['telephone'] = 'Tel: ' . $fields['telephone'];

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
                $mail->setSubject(html_entity_decode('Обратный звонок', ENT_QUOTES, 'UTF-8'));
                $mail->setText($this->load->view('mail/callback', $data));
                $mail->send();

                $json = [
                    'status'   => 'success',
                    'message'  => 'Загрузка очень высока, мы перезвоним вам в ближайшее время. Спасибо!',
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
    }
}